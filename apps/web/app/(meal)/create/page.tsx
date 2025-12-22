import CreateMealNavbar from "./_components/CreateMealNavbar"
import CreateMealForm from "./_components/CreateMealForm"

export default function CreateMealPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light">
      <CreateMealNavbar />
      <main className="flex-1 px-4 py-6">
        <CreateMealForm />
      </main>
    </div>
  )
}


