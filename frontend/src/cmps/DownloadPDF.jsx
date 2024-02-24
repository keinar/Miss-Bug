import jsPDF from "jspdf"
import React from "react"

export default function DownloadPDF({ bugsToDisplay }) {
  const downloadBugsPDF = async () => {
    const pdf = new jsPDF()
    let yPosition = 10
    pdf.setFontSize(12)
    pdf.text("Bugs:", 10, yPosition)
    yPosition += 10

    bugsToDisplay.forEach(bug => {
      if (yPosition > 260) {
        pdf.addPage()
        yPosition = 10
      }
      pdf.setFontSize(12)
      pdf.text(`Bug ${bug._id}`, 10, yPosition)
      yPosition += 10
      pdf.text(`Title: ${bug.title}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Description: ${bug.description}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Severity: ${bug.severity}`, 20, yPosition)
      yPosition += 10
      if (bug.labels) {
        pdf.text(`Labels: ${bug.labels.join(", ")}`, 20, yPosition)
        yPosition += 10
      }
    })

    pdf.save("bugs.pdf")
  }
  return <button onClick={downloadBugsPDF}>Download PDF</button>
}
