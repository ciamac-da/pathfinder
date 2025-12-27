import React from 'react';
import { DNA } from 'react-loader-spinner'; 
import styles from '@/components/_shared/Spinner/Spinner.module.scss';

const Spinner: React.FC = () => {
    return (
        <div className={styles.wrapper}>
        <DNA
        visible={true}
        height="180"
        width="180"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        dnaColorOne="c34580"
        wrapperClass={styles.spinner}
        />
        </div>
    );
};

export default Spinner;
