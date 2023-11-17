import Header from "./Header"
import Footer from "./Footer"

export default function InvalidID(props) {
    return (
        <>
            <Header />
            <div className="pt-20 h-screen backdrop-blur-xl bg-gradient-to-t from-[#070E25] to-black">
                <div className="items-center w-full justify-center flex pt-8">
                    <img src={`${process.env.PUBLIC_URL}/sad-face-4677.svg`}/>
                </div>
                <div className="pt-24 flex flex-col w-full items-center justify-center">
                    <p className="text-5xl font-extrabold text-blue-500 text-center">Sorry, the invite you're trying to access is either expired or invalid.</p>
                    <p className="text-3xl font-semibold text-blue-500 pt-12">Please try again or contact <a href="mailto:support@entropi.app">support@entropi.app</a> for assistance</p>
                </div>
                <Footer />
            </div>
        </>
    )
}