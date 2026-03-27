import PlanningCreateForm from "@/components/PlanningCreateForm"
import { getTranslations } from "next-intl/server"

const DatePlannerPage = async () => {
  const t = await getTranslations("DatePlanner")

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </header>

      <PlanningCreateForm />
    </div>
  )
}

export default DatePlannerPage
