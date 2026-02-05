import Link from "next/link";

export default function Header({ currentUser }: { currentUser: any }) { 
    return (
        <nav className="navbar navbar-light bg-light">
            <div>
                <Link href="/" className="navbar-brand">
                    GitTix
                </Link>
            </div>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                   {currentUser ? 'Sign Out' : 'Sign In/up'}
                </ul>
            </div>
        </nav>  
    );
}