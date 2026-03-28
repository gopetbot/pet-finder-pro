import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Trash2 } from 'lucide-react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'

import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { uploadPalestraImage } from '@/services/storageService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Data model
interface Palestra {
  id: string
  titulo: string
  palestrante: string
  data: string
  resumo: string
  imageUrl: string
  createdAt: Timestamp
}

type PalestraFormData = Omit<Palestra, 'id' | 'createdAt' | 'imageUrl'>

// Zod schema: all fields required, non-empty after trim
const palestraSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  palestrante: z.string().trim().min(1, 'Palestrante é obrigatório'),
  data: z.string().trim().min(1, 'Data é obrigatória'),
  resumo: z.string().trim().min(1, 'Resumo é obrigatório'),
})

export default function AdminPalestras() {
  const { signOut } = useAuth()
  const [palestras, setPalestras] = useState<Palestra[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [fileError, setFileError] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PalestraFormData>({
    resolver: zodResolver(palestraSchema),
  })

  // Real-time list with onSnapshot
  useEffect(() => {
    const q = query(collection(db, 'palestras'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Palestra, 'id'>),
      }))
      setPalestras(docs)
      setListLoading(false)
    })
    return unsubscribe
  }, [])

  const handleAddPalestra = async (formData: PalestraFormData) => {
    console.log('[handleAddPalestra] called', { formData })
    const file = fileRef.current?.files?.[0]
    console.log('[handleAddPalestra] file:', file)
    if (!file) {
      setFileError('Imagem é obrigatória')
      return
    }

    setIsUploading(true)
    try {
      console.log('[handleAddPalestra] calling uploadPalestraImage...')
      const imageUrl = await uploadPalestraImage(file)
      console.log('[handleAddPalestra] imageUrl:', imageUrl)
      await addDoc(collection(db, 'palestras'), {
        ...formData,
        imageUrl,
        createdAt: serverTimestamp(),
      })
      toast('Palestra adicionada com sucesso!')
      reset()
      setPreviewUrl('')
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      console.error('[AdminPalestras] handleAddPalestra error:', err)
      toast('Erro ao adicionar palestra.', {
        description: err instanceof Error ? err.message : 'Tente novamente.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'palestras', id))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin - Palestras</h1>
        <Button variant="outline" onClick={signOut}>
          Sair
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Form card */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Palestra</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { console.log('[form] onSubmit fired'); return handleSubmit(handleAddPalestra)(e) }} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" {...register('titulo')} />
                {errors.titulo && (
                  <p className="text-sm text-destructive">{errors.titulo.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="palestrante">Palestrante</Label>
                <Input id="palestrante" {...register('palestrante')} />
                {errors.palestrante && (
                  <p className="text-sm text-destructive">{errors.palestrante.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="data">Data</Label>
                <Input id="data" type="date" {...register('data')} />
                {errors.data && (
                  <p className="text-sm text-destructive">{errors.data.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="resumo">Resumo</Label>
                <Textarea id="resumo" rows={4} {...register('resumo')} />
                {errors.resumo && (
                  <p className="text-sm text-destructive">{errors.resumo.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="imageFile">Imagem</Label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file))
                      setFileError('')
                    }
                  }}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="mt-2 h-32 w-auto rounded-md object-cover" />
                )}
                {fileError && <p className="text-sm text-destructive">{fileError}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A otimizar e enviar imagem...
                  </>
                ) : (
                  'Adicionar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Palestras list */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Palestras Cadastradas</h2>

          {listLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : palestras.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma palestra cadastrada.
            </p>
          ) : (
            <ul className="space-y-3">
              {palestras.map((palestra) => (
                <li key={palestra.id}>
                  <Card>
                    <CardContent className="flex items-start justify-between gap-4 pt-4">
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium truncate">{palestra.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {palestra.palestrante} · {palestra.data}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {palestra.resumo}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(palestra.id)}
                        aria-label="Deletar palestra"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
