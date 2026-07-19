"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/store/useStore"

export default function ProjectsPage() {
  const projects = useStore((state) => state.projects)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kho Dự Án</h1>
          <p className="text-muted-foreground mt-1">Danh sách dự án và toàn bộ tài liệu bán hàng (Media, Sales Kit, Pháp lý).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-all border-muted group cursor-pointer h-full flex flex-col">
              <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
                <Building className="h-16 w-16 text-muted-foreground" />
                <Badge className={`absolute top-4 left-4 bg-primary hover:bg-primary/80 text-white border-none`}>
                  {project.status}
                </Badge>
              </div>
              <CardContent className="p-5 flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {project.location}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Tag className="h-4 w-4" /> {project.type} • {project.revenue}
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span>Tổng: {project.totalUnits}</span>
                    <span>Đã bán: {project.soldUnits}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
