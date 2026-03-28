import { getDriveImageUrl } from "@/lib/driveImage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Palestra {
  id: string
  titulo: string
  palestrante: string
  data: string
  resumo: string
  driveImageId: string
}

interface PalestraCardProps {
  palestra: Palestra
}

export function PalestraCard({ palestra }: PalestraCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={getDriveImageUrl(palestra.driveImageId)}
        alt={palestra.titulo}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>{palestra.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{palestra.palestrante}</p>
        <p className="text-sm text-muted-foreground">{palestra.data}</p>
        <p className="text-sm">{palestra.resumo}</p>
      </CardContent>
    </Card>
  )
}
