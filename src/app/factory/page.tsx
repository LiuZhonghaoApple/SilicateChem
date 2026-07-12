import { permanentRedirect } from "next/navigation";

export default function FactoryPage() {
  permanentRedirect("/about");
}
