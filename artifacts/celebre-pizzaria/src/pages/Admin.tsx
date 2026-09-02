import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ExternalLink,
  ImagePlus,
  LogOut,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLandingContent } from '@/content/content-provider';
import { cloneLandingContent, updateBrandLogo as changeBrandLogo, updateCatalogItem as changeCatalogItem, updateCatalogItemImage as changeCatalogItemImage, updateSectionImage as changeSectionImage, updateSectionTitle as changeSectionTitle, type ImageSlot, type LandingContent, type LandingSectionId } from '@/content/landing-content';
import { DEFAULT_MEDIA_ASSETS } from '@/content/landing-defaults';
import { fetchPublishedContent } from '@/content/remote-content-repository';
import { useAdminSession } from '@/hooks/use-admin-session';
import { AdminApiError, resetLandingContent, updateLandingContent } from '@/lib/admin-client';
import { createLocalMediaStorage } from '@/storage/local-media-storage';
import { createRemoteMediaStorage } from '@/storage/remote-media-storage';
import type { MediaAsset, MediaStorage } from '@/storage/media-storage';
import AdminLogin from './AdminLogin';

function ImageSlotEditor({
  image,
  assets,
  fieldId,
  onSelect,
  onUpload,
}: {
  image: ImageSlot;
  assets: MediaAsset[];
  fieldId: string;
  onSelect: (src: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted">
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{image.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{image.purpose}</p>
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
            section slot: {image.slotId} · media key: {image.mediaKey}
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2">
          <Label htmlFor={`asset-${fieldId}`}>Escolher asset disponível</Label>
          <select
            id={`asset-${fieldId}`}
            value=""
            onChange={(event) => onSelect(event.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Selecione uma imagem disponível</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.url}>
                {asset.kind === 'preview' ? 'Preview temporário' : asset.kind === 'remote' ? 'Vercel Blob' : 'Asset do projeto'} — {asset.pathname}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`url-${fieldId}`}>URL da imagem selecionada</Label>
          <Input
            id={`url-${fieldId}`}
            value={image.src}
            onChange={(event) => onSelect(event.target.value)}
            placeholder="URL pública do Blob ou asset local"
          />
        </div>
      </div>

      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline">
        <Upload className="h-4 w-4" aria-hidden="true" />
        <span>Enviar nova imagem para o Vercel Blob</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = '';
          }}
        />
      </label>
    </div>
  );
}

function LoadingAdmin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Verificando acesso administrativo…</p>
    </main>
  );
}

function getImageSlots(content: LandingContent): ImageSlot[] {
  return [
    content.branding.logo,
    ...content.sections.flatMap((section) => section.images),
    ...content.catalog.map((item) => item.image),
  ];
}

export default function Admin() {
  const { status, login, logout } = useAdminSession();
  const {
    content: publishedContent,
    replaceContent,
    resetContent: resetLocalContent,
  } = useLandingContent();
  const [draft, setDraft] = useState<LandingContent>(() => cloneLandingContent(publishedContent));
  const [revision, setRevision] = useState<string | undefined>();
  const [dirty, setDirty] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [contentSyncing, setContentSyncing] = useState(true);
  const [mediaStorage, setMediaStorage] = useState<MediaStorage | null>(null);
  const localMediaStorage = useMemo(() => createLocalMediaStorage(DEFAULT_MEDIA_ASSETS), []);
  const remoteMediaStorage = useMemo(() => createRemoteMediaStorage(), []);

  useEffect(() => {
    if (!dirty) setDraft(cloneLandingContent(publishedContent));
  }, [dirty, publishedContent]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let active = true;
    void remoteMediaStorage
      .list()
      .then((availableAssets) => {
        if (!active) return;
        setMediaStorage(remoteMediaStorage);
        setAssets(availableAssets);
      })
      .catch(() => {
        if (!active) return;
        setMediaStorage(localMediaStorage);
        void localMediaStorage.list().then(setAssets);
      });
    return () => {
      active = false;
    };
  }, [localMediaStorage, remoteMediaStorage, status]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let active = true;
    setContentSyncing(true);
    void fetchPublishedContent()
      .then((document) => {
        if (!active || !document) return;
        setRevision(document.revision);
        if (!dirty) {
          setDraft(cloneLandingContent(document.content));
          replaceContent(document.content);
        }
      })
      .catch(() => {
        // The local draft remains available when the remote document is absent.
      })
      .finally(() => {
        if (active) setContentSyncing(false);
      });
    return () => {
      active = false;
    };
  }, [dirty, replaceContent, status]);

  const mutate = (update: (current: LandingContent) => LandingContent) => {
    setDraft((current) => update(current));
    setDirty(true);
    setNotice('Alterações pendentes. Clique em “Salvar alterações” para publicar.');
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const uploadImage = async (
    file: File,
    image: ImageSlot,
    onSelect: (src: string) => void,
  ) => {
    const storage = mediaStorage ?? localMediaStorage;
    try {
      const asset = await storage.upload(file, { slotId: image.mediaKey });
      setAssets(await storage.list());
      onSelect(asset.url);
      showNotice(storage === localMediaStorage ? 'Preview local criado. Configure o Blob para publicar a imagem.' : 'Imagem enviada. Salve as alterações para publicar o conteúdo.');
    } catch {
      showNotice('Não foi possível enviar a imagem.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const document = await updateLandingContent(draft, revision);
      setRevision(document.revision);
      replaceContent(document.content);
      setDraft(cloneLandingContent(document.content));
      setDirty(false);
      showNotice('Alterações publicadas com sucesso.');
    } catch (cause) {
      if (cause instanceof AdminApiError && cause.status === 409) {
        showNotice('Conflito de edição: recarregue a página antes de salvar.');
      } else {
        showNotice(cause instanceof AdminApiError ? cause.message : 'Não foi possível publicar as alterações.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const document = await resetLandingContent(revision);
      setRevision(document.revision);
      replaceContent(document.content);
      setDraft(cloneLandingContent(document.content));
      setDirty(false);
      showNotice('Conteúdo restaurado para os defaults publicados.');
    } catch {
      resetLocalContent();
      setDirty(false);
      showNotice('Defaults locais restaurados. O reset remoto ficará disponível após configurar o Blob.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAsset = async (asset: MediaAsset) => {
    if (asset.kind !== 'remote' && asset.kind !== 'preview') return;
    const isReferenced = getImageSlots(draft).some(
      (image) => image.src === asset.url || image.src === asset.pathname,
    );
    const message = isReferenced
      ? `A imagem "${asset.pathname}" ainda está referenciada por um slot da landing. Remover mesmo assim?`
      : `Remover a imagem "${asset.pathname}"?`;
    if (!window.confirm(message)) return;

    const storage = mediaStorage ?? localMediaStorage;
    try {
      await storage.remove(asset);
      setAssets(await storage.list());
      showNotice('Imagem removida da biblioteca de mídia.');
    } catch {
      showNotice('Não foi possível remover a imagem.');
    }
  };

  if (status === 'loading') return <LoadingAdmin />;
  if (status === 'unauthenticated') return <AdminLogin onLogin={login} />;

  const sections = draft.sections;
  const updateSectionTitle = (sectionId: LandingSectionId, title: string) =>
    mutate((current) => changeSectionTitle(current, sectionId, title));
  const updateSectionImage = (sectionId: LandingSectionId, image: ImageSlot, src: string) =>
    mutate((current) => changeSectionImage(current, sectionId, image.slotId, src));
  const updateCatalogImage = (itemId: string, src: string) =>
    mutate((current) => changeCatalogItemImage(current, itemId, src));

  const sectionImage = (sectionId: LandingSectionId, image: ImageSlot) => (
    <ImageSlotEditor
      key={`${sectionId}-${image.slotId}`}
      image={image}
      assets={assets}
      fieldId={`${sectionId}-${image.slotId}`}
      onSelect={(src) => updateSectionImage(sectionId, image, src)}
      onUpload={(file) => void uploadImage(file, image, (src) => updateSectionImage(sectionId, image, src))}
    />
  );

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-border/60 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar para a landing
            </Link>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Painel de conteúdo protegido
            </p>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl">Administração da landing</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Edite títulos e imagens usando os mesmos nomes, seções e IDs estáveis que aparecem na página pública. As alterações só são publicadas ao clicar em salvar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href="/"><ExternalLink className="h-4 w-4" aria-hidden="true" />Ver landing</Link></Button>
            <Button type="button" variant="secondary" onClick={() => void handleReset()} disabled={saving}><RotateCcw className="h-4 w-4" aria-hidden="true" />Restaurar defaults</Button>
            <Button type="button" variant="ghost" onClick={() => void logout()}><LogOut className="h-4 w-4" aria-hidden="true" />Sair</Button>
          </div>
        </header>

        {notice && <div role="status" className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"><Save className="mr-2 inline h-4 w-4" aria-hidden="true" />{notice}</div>}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-card/70"><CardContent className="p-5"><ImagePlus className="mb-3 h-6 w-6 text-primary" aria-hidden="true" /><p className="text-2xl font-bold">{sections.length}</p><p className="text-sm text-muted-foreground">Seções com IDs estáveis</p></CardContent></Card>
          <Card className="border-primary/20 bg-card/70"><CardContent className="p-5"><p className="mb-3 text-2xl font-bold text-primary">{draft.catalog.length}</p><p className="text-sm text-muted-foreground">Itens editáveis no mini catálogo</p></CardContent></Card>
          <Card className="border-secondary/30 bg-card/70"><CardContent className="p-5"><p className="mb-3 text-2xl font-bold text-secondary">{dirty ? 'Pendente' : 'Publicado'}</p><p className="text-sm text-muted-foreground">Conteúdo remoto com revisão otimista</p></CardContent></Card>
        </div>

        <div className="mb-8 flex justify-end"><Button type="button" onClick={() => void handleSave()} disabled={!dirty || saving || contentSyncing}><Save className="h-4 w-4" aria-hidden="true" />{contentSyncing ? 'Sincronizando…' : saving ? 'Publicando…' : 'Salvar alterações'}</Button></div>

        <section aria-labelledby="media-heading" className="mb-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Biblioteca de mídia</p>
            <h2 id="media-heading" className="mt-2 font-serif text-3xl font-bold">Assets disponíveis</h2>
            <p className="mt-2 text-muted-foreground">Confira os arquivos que podem ser aplicados aos slots identificados abaixo. Assets do projeto não podem ser removidos.</p>
          </div>
          {assets.length === 0 ? (
            <Card className="border-border/70 bg-card/70"><CardContent className="p-6 text-sm text-muted-foreground">Nenhuma imagem disponível no armazenamento configurado.</CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <Card key={asset.id} className="border-border/70 bg-card/70">
                  <CardContent className="flex gap-4 p-4">
                    <img src={asset.url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{asset.pathname}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {asset.kind === 'remote' ? 'Vercel Blob' : asset.kind === 'preview' ? 'Preview local' : 'Asset do projeto'}
                      </p>
                      {(asset.kind === 'remote' || asset.kind === 'preview') && (
                        <Button type="button" size="sm" variant="ghost" className="mt-2 px-0 text-destructive hover:text-destructive" onClick={() => void handleRemoveAsset(asset)}>
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Remover
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="sections-heading">
          <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Landing pública</p><h2 id="sections-heading" className="mt-2 font-serif text-3xl font-bold">Seções e imagens</h2><p className="mt-2 text-muted-foreground">Cada card abaixo corresponde a uma seção visual da landing. O sectionId e o propósito indicam exatamente onde a troca será aplicada.</p></div>
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id} data-section-id={section.id} className="overflow-hidden border-border/70 bg-card/70">
                <CardHeader className="border-b border-border/50"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle className="text-xl">{section.label}</CardTitle><CardDescription className="mt-2 font-mono text-xs">sectionId: {section.id}</CardDescription></div><span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">{section.images.length} {section.images.length === 1 ? 'slot de imagem' : 'slots de imagem'}</span></div></CardHeader>
                <CardContent className="space-y-5 p-6"><div className="space-y-2"><Label htmlFor={`title-${section.id}`}>Título — {section.label}</Label><Textarea id={`title-${section.id}`} value={section.title} onChange={(event) => updateSectionTitle(section.id, event.target.value)} rows={2} /></div><div className="space-y-3">{section.images.map((image) => sectionImage(section.id, image))}</div></CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="branding-heading" className="mt-12"><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Identidade</p><h2 id="branding-heading" className="mt-2 font-serif text-3xl font-bold">Logo principal</h2></div><Card className="border-border/70 bg-card/70"><CardContent className="p-6"><ImageSlotEditor image={draft.branding.logo} assets={assets} fieldId="branding-logo" onSelect={(src) => mutate((current) => changeBrandLogo(current, src))} onUpload={(file) => void uploadImage(file, draft.branding.logo, (src) => mutate((current) => changeBrandLogo(current, src)))} /></CardContent></Card></section>

        <section aria-labelledby="catalog-heading" className="mt-12"><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Cardápio</p><h2 id="catalog-heading" className="mt-2 font-serif text-3xl font-bold">Mini catálogo</h2><p className="mt-2 text-muted-foreground">Os IDs abaixo identificam cada item individualmente no cardápio público.</p></div><div className="grid gap-6 lg:grid-cols-2">{draft.catalog.map((item, index) => (<Card key={item.id} data-catalog-item-id={item.id} className="border-border/70 bg-card/70"><CardHeader><CardTitle className="text-lg">{index + 1}. {item.name}</CardTitle><CardDescription className="font-mono text-xs">catalogItemId: {item.id}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 sm:grid-cols-[1fr_0.35fr]"><div className="space-y-2"><Label htmlFor={`catalog-name-${item.id}`}>Nome do item</Label><Input id={`catalog-name-${item.id}`} value={item.name} onChange={(event) => mutate((current) => changeCatalogItem(current, item.id, { name: event.target.value }))} /></div><div className="space-y-2"><Label htmlFor={`catalog-price-${item.id}`}>Preço</Label><Input id={`catalog-price-${item.id}`} value={item.price} onChange={(event) => mutate((current) => changeCatalogItem(current, item.id, { price: event.target.value }))} /></div></div><div className="space-y-2"><Label htmlFor={`catalog-description-${item.id}`}>Descrição</Label><Textarea id={`catalog-description-${item.id}`} value={item.description} onChange={(event) => mutate((current) => changeCatalogItem(current, item.id, { description: event.target.value }))} rows={3} /></div><ImageSlotEditor image={item.image} assets={assets} fieldId={`${item.id}-${item.image.slotId}`} onSelect={(src) => updateCatalogImage(item.id, src)} onUpload={(file) => void uploadImage(file, item.image, (src) => updateCatalogImage(item.id, src))} /></CardContent></Card>))}</div></section>

        <footer className="mt-12 rounded-2xl border border-secondary/30 bg-secondary/10 p-5 text-sm leading-relaxed text-foreground/80"><p className="font-semibold text-secondary">Armazenamento de mídia</p><p className="mt-2">Uploads administrativos são limitados a JPEG, PNG e WebP de até 10 MiB e enviados ao prefixo seguro do Vercel Blob. Se o Blob ainda não estiver configurado, o painel informa quando estiver usando apenas o preview local.</p></footer>
      </div>
    </main>
  );
}
