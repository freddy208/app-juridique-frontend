import type { Client } from "@/lib/types/client.types"

/**
 * Export clients data to Excel format (CSV)
 */
export function exportClientsToExcel(clients: Client[], filename = "clients") {
  // Create CSV header
  const headers = [
    "Numéro Client",
    "Prénom",
    "Nom",
    "Email",
    "Téléphone",
    "Type",
    "Statut",
    "VIP",
    "Profession",
    "Entreprise",
    "Adresse",
    "Ville",
    "Code Postal",
    "Pays",
    "Dernière Visite",
    "Date de Création",
  ]

  // Create CSV rows
  const rows = clients.map((client) => [
    client.numeroClient || "",
    client.prenom,
    client.nom,
    client.email,
    client.telephone,
    client.typeClient,
    client.statut,
    client.estVip ? "Oui" : "Non",
    client.profession || "",
    client.entreprise || "",
    client.adresse || "",
    client.ville || "",
    client.codePostal || "",
    client.pays || "",
    client.derniereVisite ? new Date(client.derniereVisite).toLocaleDateString("fr-FR") : "",
    new Date(client.creeLe).toLocaleDateString("fr-FR"),
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  // Create blob and download
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
