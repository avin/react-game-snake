import React from 'react';
import styles from './styles.module.scss';

export default class WaitCircle extends React.Component {
    render() {
        return (
            <svg className={styles.main}>
                <circle className={styles.circle} r="18" cx="20" cy="20" />
            </svg>
        );
    }
}
