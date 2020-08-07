import React from 'react';
import { Link } from 'react-router';
import styles from './LeftSubSidebar.scss';
import { prioritySearch } from '../../utils/jsUtils';

interface LeftSidebarItem {
  name: string;
}

interface LeftSidebarSectionProps extends React.ComponentProps<'div'> {
  items: LeftSidebarItem[];
  currentItem?: LeftSidebarItem;
  getServiceEntityLink: (s: string) => string;
  service: string;
  sidebarIcon?: string;
}

const LeftSidebarSection = ({
  items = [],
  currentItem,
  service,
  sidebarIcon,
  getServiceEntityLink,
}: LeftSidebarSectionProps) => {
  // TODO needs refactor to accomodate other services

  const [searchText, setSearchText] = React.useState('');

  const getSearchInput = () => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
      setSearchText(e.target.value);
    return (
      <input
        type="text"
        onChange={handleSearch}
        className="form-control"
        placeholder={`search ${service}`}
        data-test={`search-${service}`}
      />
    );
  };

  // TODO test search
  const itemList = prioritySearch(searchText, items, 'name');

  const getChildList = () => {
    let childList;
    if (itemList.length === 0) {
      childList = (
        <li className={styles.noChildren} data-test="sidebar-no-services">
          <i>No {service} available</i>
        </li>
      );
    } else {
      childList = itemList.map(a => {
        let activeTableClass = '';
        if (currentItem && currentItem.name === a.name) {
          activeTableClass = styles.activeLink;
        }

        return (
          <li
            className={activeTableClass}
            key={a.name}
            data-test={`action-sidebar-links-${a.name}`}
          >
            <Link to={getServiceEntityLink(a.name)} data-test={a.name}>
              <i
                className={`${styles.tableIcon} fa ${
                  sidebarIcon || 'fa-wrench'
                }`}
                aria-hidden="true"
              />
              {a.name}
            </Link>
          </li>
        );
      });
    }

    return childList;
  };

  return {
    getChildList,
    getSearchInput,
    count: itemList.length,
  };
};

export default LeftSidebarSection;
