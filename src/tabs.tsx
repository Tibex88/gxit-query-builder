// import { NavLink } from "@remix-run/react";
import { NavLink } from "react-router-dom";
interface TabItem {
  label: string;
  href: string;
}

const Tabs = ({ tabs }: { tabs: TabItem[] }) => {
  return (
    <div className="border-b text-center text-sm font-medium text-foreground/65">
      <ul className="-mb-px flex flex-wrap px-12">
        {tabs.map((t) => (
          <li className="me-2" key={t.href}>
            <NavLink
              to={t.href}
              replace={true}
              className={({ isActive }) =>
                `inline-block border-b-2 p-2 pb-1 ${
                  isActive
                    ? "active border-foreground font-bold text-foreground"
                    : "border-transparent"
                }`
              }
            >
              {t.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
