import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { PalestraCard, type Palestra } from "./PalestraCard"

export function PalestrasList() {
  const [palestras, setPalestras] = useState<Palestra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getDocs(collection(db, "palestras"))
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Palestra))
        setPalestras(docs)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-destructive py-8">
        Não foi possível carregar as palestras.
      </p>
    )
  }

  if (palestras.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhuma palestra cadastrada ainda.
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {palestras.map((palestra) => (
        <PalestraCard key={palestra.id} palestra={palestra} />
      ))}
    </div>
  )
}
