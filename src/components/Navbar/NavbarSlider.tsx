'use client';
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation"; // Import the hook
import { IoClose } from "react-icons/io5"; // Close icon
import { FiMenu } from "react-icons/fi"; // Menu icon
import users from '@/assests/user.png'
import creators from '@/assests/event-creator.png'
import delivery from '@/assests/delivery-box.png'
import payment from "@/assests/user.png"
import dashboard from "@/assests/dashboard.png"
import logout from '@/assests/logout.png'
import addProduct from "@/assests/add-product.png"
import logo from "@/assests/logo.png"
import order from '@/assests/order.png'
import approve from '@/assests/approved.png'
import { FaRegUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/Redux/ReduxFunction";
import Cookies from "js-cookie";
import { AppDispatch, RootState } from "@/Redux/store";
import { useState } from "react";

interface NavItem {
  label: string;
  route?: string;
  iconPath: StaticImageData;
  subItems?: NavItem[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navigation: NavItem[] = [
  { label: "Dashboard", route: "/", iconPath: dashboard },
  { 
    label: "E-commerce", 
    iconPath: delivery,
    subItems: [
      { label: "Products", route: "/all-products", iconPath: delivery },
      { label: "Add Product", route: "/add-product", iconPath: addProduct },
      { label: "Order History", route: "/order-history", iconPath: order },
    ]
  },
  { label: "Users", route: "/users", iconPath: users },
  { label: "Blog", route: "/add-blog", iconPath: payment },
];

const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const path = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const { name } = useSelector((state: RootState) => state.Auth);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = path === item.route;
    const isDropdownOpen = openDropdowns.includes(item.label);

    if (item.subItems) {
      return (
        <li key={item.label}>
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`w-full relative flex items-center justify-between h-11 pr-6 py-[10px] pl-[24px] text-lg transition-all my-3 duration-300 
              ${isDropdownOpen
                ? "poppins-semibold text-white border-l-4 border-primary bg-gradient-to-r from-primary/80 to-primary/60"
                : "text-black border-l-4 border-transparent hover:border-primary hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary/60 hover:text-black"
              }`}
          >
            <div className="flex items-center">
              <Image src={item.iconPath} alt={item.label} width={20} height={20} className="ml-2" />
              {isOpen && <span className="ml-3 text-[18px] tracking-wide truncate">{item.label}</span>}
            </div>
            {isOpen && (
              <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            )}
          </button>
          {isDropdownOpen && isOpen && (
            <ul className="py-2 space-y-2">
              {item.subItems.map(subItem => (
                <li key={subItem.route}>
                  <Link
                    href={subItem.route || '#'}
                    className={`flex items-center w-full p-2 text-base text-gray-900 transition duration-75 pl-[52px] group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                      path === subItem.route ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    <Image src={subItem.iconPath} alt={subItem.label} width={16} height={16} className="mr-2" />
                    <span className="text-[16px]">{subItem.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.route}>
        <Link
          href={item.route || '#'}
          className={`relative flex items-center h-11 pr-6 py-[10px] pl-[24px] text-lg transition-all my-3 duration-300 ${
            isActive
              ? "poppins-semibold text-white border-l-4 border-primary bg-gradient-to-r from-primary/80 to-primary/60"
              : "text-black border-l-4 border-transparent hover:border-primary hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary/60 hover:text-black"
          }`}
        >
          <Image src={item.iconPath} alt={item.label} width={20} height={20} className="ml-2" />
          {isOpen && <span className="ml-3 text-[18px] tracking-wide truncate">{item.label}</span>}
        </Link>
      </li>
    );
  };

  const route = useRouter()

  const handleLogOut = () => {
    dispatch(logOut())
    Cookies.remove("accessToken")
    route.push("/login")

  }

  return (
    <div className="relative flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute z-50 top-4 left-4 text-black p-2 rounded-md bg-white shadow-md"
      >
        {isOpen ? <IoClose size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Content */}
      <div
        className={`h-screen bg-white duration-300 flex flex-col  font-inter ${isOpen ? 'w-[250px]' : 'w-[80px]'
          }`}
      >
        {/* Logo */}
        {isOpen && (
          <Link href="/" className="flex justify-center ">
            <Image width={120} height={120} className="w-48" src={logo} alt="logo_image" />
          </Link>
        )}

        <div className={`flex flex-col justify-between  h-screen pb-11 ${isOpen ? "pt-0" : 'pt-14'}`}>
          {/* Navigation */}
          <div className="space-y-3">
            <ul className="pt-2 pb-4 space-y-1 text-sm">{navigation.map(renderNavItem)}</ul>
          </div>

          {/* Logout Button */}
          <div>
            {name && (
              <div className={`flex px-8 space-x-2 justify-center items-center text-lg ${isOpen ? 'block' : 'hidden'}`}>
                <FaRegUser className="text-2xl text-primary" />
                <p className={`font-semibold text-primary lg:block `}>Hello, {name}</p>
              </div>
            )}
            <button
              onClick={handleLogOut}
              className={`relative flex items-center h-11 pr-6 py-[10px] pl-[24px] text-lg transition-all duration-300 poppins-semibold hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary/60 to-white text-black border-l-4 ${isOpen ? '' : 'justify-center'
                }`}
            >
              <Image src={logout} alt="logout" width={20} height={20} className="ml-2" />
              {isOpen && <span className="ml-3 text-[18px] tracking-wide truncate ">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSlider;
