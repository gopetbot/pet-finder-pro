import { useEffect, useState } from 'react'
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
  driveImageId: string
  createdAt: Timestamp
}

type PalestraFormData = Omit<Palestra, 'id' | 'createdAt'>

// 6.1 - Zod schema: all fields required, non-empty after trim
const palestraSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  palestrante: z.string().trim().min(1, 'Palestrante é obrigatório'),
  data: z.string().trim().min(1, 'Data é obrigatória'),
  resumo: z.string().trim().min(1, 'Resumo é obrigatório'),
  driveImageId: z.string().trim().min(1, 'ID da imagem é obrigatório'),
})

export default function AdminPalestras() {
  const { signOut } = useAuth()
  const [palestras, setPalestras] = useState<Palestra[]>([])
  const [listLoading, setListLoading] = useState(true)

  // 6.1 - Controlled form with react-hook-form + zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PalestraFormData>({
    resolver: zodResolver(palestraSchema),
  })

  // 6.4 - Real-time list with onSnapshot
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

  // 6.2 - handleAddPalestra
  const handleAddPalestra = async (formData: PalestraFormData) => {
    try {
      await addDoc(collection(db, 'palestras'), {
        ...formData,
        createdAt: serverTimestamp(),
      })
      // 6.3 - Toast success + reset
      toast('Palestra adicionada com sucesso!')
      reset()
    } catch {
      // 6.3 - Toast error, preserve form data (no reset)
      toast('Erro ao adicionar palestra.', {
        description: 'Tente novamente.',
      })
    }
  }

  // 6.5 - handleDelete
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'palestras', id))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 6.6 - Page header with logout button */}
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
            <form onSubmit={handleSubmit(handleAddPalestra)} className="space-y-4">
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
                <Label htmlFor="driveImageId">ID da Imagem (Google Drive)</Label>
                <Input id="driveImageId" {...register('driveImageId')} />
                {errors.driveImageId && (
                  <p className="text-sm text-destructive">{errors.driveImageId.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar
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
