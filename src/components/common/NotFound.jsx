export default function NotFound({ message = "User not found" }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
            <img
                src="/images/404.png"
                alt="Not Found"
                className="w-70 mb-6 opacity-70"
            />
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <p className="text-sm">Vui lòng kiểm tra lại đường dẫn</p>
        </div>
    );
}
