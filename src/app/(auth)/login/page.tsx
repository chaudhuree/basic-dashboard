import Link from "next/link";
import LogIn from "./LogIn";

export default function Page() {
    return (
        <div>
            <LogIn></LogIn>
            <div className="absolute bottom-5 right-5">
            <Link href={'/privacy-policy'}><span className="text-gray-500 text-sm">Privacy & Policy</span></Link>
            </div>
        </div>
    );
}