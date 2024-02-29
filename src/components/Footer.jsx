export default function Footer(props) {
    return (
        <footer className="absolute right-0 bottom-0 w-full flex justify-between items-center h-10 px-4 border-t border-gray-300 overflow-none">
            <p className="text-sm text-gray-700">© 2023</p>
            <a href="/terms" className="text-sm text-gray-700 hover:underline">Terms</a>
        </footer>
    );
}