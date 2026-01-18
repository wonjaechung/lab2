import Link from 'next/link';
import { BithumbIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
    { name: '인사이트', href: '/' },
    { name: '내부 데이터', href: '/internal-data' },
    { name: '외부 데이터', href: '/external-data' },
    { name: '멤버쉽', href: '/membership' },
];

export function Header() {
    return (
        <header className="flex items-center justify-between py-4 border-b">
            <Link href="/" className="flex items-center gap-3">
                <BithumbIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold tracking-tight text-foreground">
                    Bithumb Data Lab
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                    <Button key={item.name} variant="ghost" asChild>
                        <Link href={item.href} className="text-base font-medium text-muted-foreground hover:text-foreground">
                            {item.name}
                        </Link>
                    </Button>
                ))}
            </nav>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="flex flex-col gap-4 p-4">
                            <Link href="/" className="flex items-center gap-3 mb-4">
                                <BithumbIcon className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold tracking-tight text-foreground">
                                    Bithumb Data Lab
                                </span>
                            </Link>
                            <div className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <Button key={item.name} variant="ghost" asChild className="justify-start font-medium w-full">
                                        <Link href={item.href}>
                                            {item.name}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
