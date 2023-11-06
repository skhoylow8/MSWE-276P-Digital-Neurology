'use client';
import React, { useState } from 'react';
import { MultiSelect } from "react-multi-select-component";

const Multiselect = ({ data }) => {
    const [selected, setSelected] = useState([]);

    return (
        <MultiSelect
          options={data}
          value={selected}
          onChange={setSelected}
        />
    );
}

export default Multiselect