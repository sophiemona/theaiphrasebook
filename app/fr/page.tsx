import HomePage from "@/components/HomePage"
import messages from "@/messages/fr.json"
import en from "@/messages/en.json"

export default function PageFr() {
  return (
    <HomePage
      locale="fr"
      messages={messages}
      staticMessages={{ credits: en.credits, footer: en.footer }}
    />
  )
}
