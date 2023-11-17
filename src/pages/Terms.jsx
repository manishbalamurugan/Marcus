import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Terms(props){
    return(<>
        <Header />
            <div className="pt-20 h-screen backdrop-blur-xl bg-gradient-to-t from-[#070E25] to-black flex overflow-y-auto">
                <div className="h-full w-full p-16">
                    <p className="text-5xl font-bold text-white">Terms</p>
                    <p className="text-2xl font-semibold text-gray-500 pt-4">Last Updated 11/08/23</p>
                    <div className="w-full pt-12 text-white">
                        <p>Test</p>
                    </div>
                </div>
                <Footer />
            </div>
    
    </>)
}