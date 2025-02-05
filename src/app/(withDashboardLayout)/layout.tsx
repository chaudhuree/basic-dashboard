import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
    
    return (
        <main>
            <div className="flex max-h-screen">
                <Navbar />
                <div className="w-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </main>
    );
}