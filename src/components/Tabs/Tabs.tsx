
import { NavLink } from 'react-router-dom';
import type { ITab } from '../../models/models';

interface TabProps {
    tabs: ITab[];
}
const Tabs: React.FC<TabProps> = ({ tabs }) => {
    return (
        <ul className="flex items-end text-sm tab-list text-textSecondary">
            {tabs.map((tab: ITab) => {
                return (
                    <NavLink
                        to={tab.link}
                        className={({ isActive }) =>
                            isActive
                                ? 'text-primaryBlue border-primaryBlue border-b px-4 p-1'
                                : ' p-1 border-b px-4 border-gray-300'
                        }
                        key={tab.id}
                    >
                        <p>{tab.name}</p>
                    </NavLink>
                );
            })}
            <li className=" flex-1 border-b border-gray-300"></li>
        </ul>
    );
};

export default Tabs;
