import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ExternalLink,
  ImagePlus,
  RotateCcw,
  Save,
  Sparkles,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLandingContent } from '@/content/content-provider';
import { DEFAULT_MEDIA_ASSETS } from '@/content/landing-defaults';
import type { ImageSlot, LandingSectionId } from '@/content/landing-content';
import { createLocalMediaStorage } from '@/storage/local-media-storage';
import { MEDIA_STORAGE_INTEGRATION_NOTE, type MediaAsset } from '@/storage/media-storage';

const localMediaStorage = createLocalMediaStorage(DEFAULT_MEDIA_ASSETS);

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
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground">slot: {image.slotId}</p>
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
            <option value="">Selecione uma imagem local</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.url}>
                {asset.kind === 'preview' ? 'Preview temporário' : 'Asset do projeto'} — {asset.pathname}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`url-${fieldId}`}>URL da imagem</Label>
          <Input
            id={`url-${fieldId}`}
            value={image.src}
            onChange={(event) => onSelect(event.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline">
        <Upload className="h-4 w-4" aria-hidden="true" />
        <span>Testar preview de arquivo nesta sessão</span>
        <input
          type="file"
          accept="image/*"
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

export default function Admin() {
  const {
    content,
    updateBrandLogo,
    updateCatalogItem,
    updateCatalogItemImage,
    updateSectionImage,
    updateSectionTitle,
    resetContent,
  } = useLandingContent();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    void localMediaStorage.list().then((availableAssets) => {
      if (active) setAssets(availableAssets);
    });
    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(() => content.sections, [content.sections]);

  const showSaved = () => {
    setNotice('Alteração salva no preview local deste navegador.');
    window.setTimeout(() => setNotice(''), 2800);
  };

  const uploadPreview = async (
    file: File,
    onSelect: (src: string) => void,
  ) => {
    const asset = await localMediaStorage.upload(file);
    setAssets(await localMediaStorage.list());
    onSelect(asset.url);
    showSaved();
  };

  const sectionImage = (sectionId: LandingSectionId, image: ImageSlot) => (
    <ImageSlotEditor
      key={`${sectionId}-${image.slotId}`}
      image={image}
      assets={assets}
      fieldId={`${sectionId}-${image.slotId}`}
      onSelect={(src) => {
        updateSectionImage(sectionId, image.slotId, src);
        showSaved();
      }}
      onUpload={(file) =>
        void uploadPreview(file, (src) => updateSectionImage(sectionId, image.slotId, src))
      }
    />
  );

  const handleReset = () => {
    resetContent();
    setNotice('Conteúdo restaurado para os defaults do projeto.');
  };

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
              Painel de conteúdo
            </p>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl">Administração da landing</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
              Edite títulos e imagens usando os mesmos nomes e IDs que aparecem na página pública.
              Assim, cada troca fica vinculada à seção correta.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Ver landing
              </Link>
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restaurar defaults
            </Button>
          </div>
        </header>

        {notice && (
          <div role="status" className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            <Save className="mr-2 inline h-4 w-4" aria-hidden="true" />
            {notice}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-card/70">
            <CardContent className="p-5">
              <ImagePlus className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <p className="text-2xl font-bold">{sections.length}</p>
              <p className="text-sm text-muted-foreground">Seções com IDs estáveis</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/70">
            <CardContent className="p-5">
              <p className="mb-3 text-2xl font-bold text-primary">{content.catalog.length}</p>
              <p className="text-sm text-muted-foreground">Itens editáveis no mini catálogo</p>
            </CardContent>
          </Card>
          <Card className="border-secondary/30 bg-card/70">
            <CardContent className="p-5">
              <p className="mb-3 text-2xl font-bold text-secondary">Preview</p>
              <p className="text-sm text-muted-foreground">Alterações locais até integrar o Storage</p>
            </CardContent>
          </Card>
        </div>

        <section aria-labelledby="sections-heading">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Landing pública</p>
            <h2 id="sections-heading" className="mt-2 font-serif text-3xl font-bold">Seções e imagens</h2>
            <p className="mt-2 text-muted-foreground">Cada card abaixo corresponde a uma seção visual da landing.</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id} data-section-id={section.id} className="overflow-hidden border-border/70 bg-card/70">
                <CardHeader className="border-b border-border/50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">{section.label}</CardTitle>
                      <CardDescription className="mt-2 font-mono text-xs">sectionId: {section.id}</CardDescription>
                    </div>
                    <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      {section.images.length} {section.images.length === 1 ? 'slot de imagem' : 'slots de imagem'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${section.id}`}>Título — {section.label}</Label>
                    <Textarea
                      id={`title-${section.id}`}
                      value={section.title}
                      onChange={(event) => {
                        updateSectionTitle(section.id, event.target.value);
                        showSaved();
                      }}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-3">
                    {section.images.map((image) => sectionImage(section.id, image))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="branding-heading" className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Identidade</p>
            <h2 id="branding-heading" className="mt-2 font-serif text-3xl font-bold">Logo principal</h2>
          </div>
          <Card className="border-border/70 bg-card/70">
            <CardContent className="p-6">
              <ImageSlotEditor
                image={content.branding.logo}
                assets={assets}
                fieldId="branding-logo"
                onSelect={(src) => {
                  updateBrandLogo(src);
                  showSaved();
                }}
                onUpload={(file) => void uploadPreview(file, (src) => updateBrandLogo(src))}
              />
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="catalog-heading" className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Cardápio</p>
            <h2 id="catalog-heading" className="mt-2 font-serif text-3xl font-bold">Mini catálogo</h2>
            <p className="mt-2 text-muted-foreground">Os IDs abaixo identificam cada item individualmente no cardápio público.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {content.catalog.map((item, index) => (
              <Card key={item.id} data-catalog-item-id={item.id} className="border-border/70 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">{index + 1}. {item.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">catalogItemId: {item.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_0.35fr]">
                    <div className="space-y-2">
                      <Label htmlFor={`catalog-name-${item.id}`}>Nome do item</Label>
                      <Input
                        id={`catalog-name-${item.id}`}
                        value={item.name}
                        onChange={(event) => {
                          updateCatalogItem(item.id, { name: event.target.value });
                          showSaved();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`catalog-price-${item.id}`}>Preço</Label>
                      <Input
                        id={`catalog-price-${item.id}`}
                        value={item.price}
                        onChange={(event) => {
                          updateCatalogItem(item.id, { price: event.target.value });
                          showSaved();
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`catalog-description-${item.id}`}>Descrição</Label>
                    <Textarea
                      id={`catalog-description-${item.id}`}
                      value={item.description}
                      onChange={(event) => {
                        updateCatalogItem(item.id, { description: event.target.value });
                        showSaved();
                      }}
                      rows={3}
                    />
                  </div>
                  <ImageSlotEditor
                    image={item.image}
                    assets={assets}
                    fieldId={`${item.id}-${item.image.slotId}`}
                    onSelect={(src) => {
                      updateCatalogItemImage(item.id, src);
                      showSaved();
                    }}
                    onUpload={(file) =>
                      void uploadPreview(file, (src) => updateCatalogItemImage(item.id, src))
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <footer className="mt-12 rounded-2xl border border-secondary/30 bg-secondary/10 p-5 text-sm leading-relaxed text-foreground/80">
          <p className="font-semibold text-secondary">Camada de mídia preparada</p>
          <p className="mt-2">{MEDIA_STORAGE_INTEGRATION_NOTE}</p>
        </footer>
      </div>
    </main>
  );
}
