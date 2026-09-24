import PairPage from '@/components/PairPage'
import { JPG, PNG } from '@/lib/formats'

export default function JpgToPngPage() {
  return <PairPage from={JPG} to={PNG} />
}
