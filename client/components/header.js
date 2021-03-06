import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href:'/auth/signup' },
        currentUser && { label: 'Sell Tickets', href:'/tickets/new' },
        currentUser && { label: 'My Orders', href:'/orders' },
        currentUser && { label: 'Sign Out', href:'/auth/signout' },
        !currentUser && { label: 'Sign In', href:'/auth/signin' },
    ].filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
        return <li key={href}>
                <Link href={href}>
                    <a className='nav-link'>{label}</a>
                </Link>
            </li>
    })
    return <nav className='navbar navbar-light bg-light'>
        <Link href='/'>
            <a className='navbar-brand'>GitTix</a>
        </Link>
        <div className='d-flex jestify-content-end'>
            <ul className='nav d-flex align-items-center'>
                {links}
            </ul>
        </div>
    </nav>
}