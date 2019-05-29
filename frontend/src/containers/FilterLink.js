import React from 'react';
import {Link} from 'react-router-dom';

const FilterLink = ({filter, disabled, onClick, children}) => (
    <Link
        to={filter === 'all' ? '' : filter}
    >
        <button
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    </Link>
);

export default FilterLink;