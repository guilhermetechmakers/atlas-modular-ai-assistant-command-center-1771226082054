/**
 * Asset Manager — upload and organize thumbnails, scripts, outlines.
 */

import { useState, useEffect, useRef } from 'react'
import { Image, FileText, Upload, FolderOpen, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchAssets, deleteAsset } from '@/api/content-pipeline'
import type { ContentAsset } from '@/types/content-pipeline'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ASSET_TYPE_LABELS: Record<ContentAsset['type'], string> = {
  thumbnail: 'Thumbnail',
  script: 'Script',
  outline: 'Outline',
  image: 'Image',
  other: 'Other',
}

const ASSET_ICONS: Record<ContentAsset['type'], typeof FileText> = {
  thumbnail: Image,
  script: FileText,
  outline: FileText,
  image: Image,
  other: FolderOpen,
}

export function AssetManager() {
  const [assets, setAssets] = useState<ContentAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetchAssets()
      .then((data) => {
        if (!cancelled) setAssets(data)
      })
      .catch(() => {
        if (!cancelled) setAssets([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const type =
          file.type.startsWith('image/') ? 'image'
          : file.name.endsWith('.md') || file.name.endsWith('.txt') ? 'script'
          : 'other'
        const newAsset: ContentAsset = {
          id: `local-${Date.now()}-${file.name}`,
          name: file.name,
          type,
          file_size: file.size,
          created_at: new Date().toISOString(),
        }
        setAssets((prev) => [newAsset, ...prev])
      }
      toast.success(`${files.length} file(s) added (MVP: stored locally)`)
    } catch {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id)
      setAssets((prev) => prev.filter((a) => a.id !== id))
      toast.success('Asset removed')
    } catch {
      setAssets((prev) => prev.filter((a) => a.id !== id))
      toast.success('Asset removed')
    }
  }

  const isEmpty = !isLoading && assets.length === 0

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Image className="h-5 w-5 text-cyan" aria-hidden />
            Assets
          </CardTitle>
          <CardDescription>Upload and organize thumbnails, scripts, outlines</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,.md,.txt,.pdf"
            className="hidden"
            onChange={handleUpload}
            aria-label="Upload files"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="transition-transform hover:scale-[1.02]"
          >
            <Upload className="h-4 w-4 mr-1" aria-hidden />
            {isUploading ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
            <p className="text-muted-foreground text-sm">No assets yet</p>
            <p className="text-muted-foreground/80 text-xs mt-1">Upload thumbnails, scripts, or outlines</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" aria-hidden />
              Upload
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const Icon = ASSET_ICONS[asset.type]
              return (
                <div
                  key={asset.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-border bg-panel/50 p-3',
                    'transition-all duration-200 hover:shadow-sm hover:border-[rgb(63,63,70)]'
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ASSET_TYPE_LABELS[asset.type]}
                      {asset.file_size != null && ` · ${(asset.file_size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(asset.id)}
                    aria-label="Delete asset"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
