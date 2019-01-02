import React from 'react';
import PropTypes from 'prop-types';
import HeartEmpty from './HeartEmpty/HeartEmpty';
import styles from './styles.module.scss';
import HeartFull from './HeartFull/HeartFull';

export default class Lives extends React.Component {
    static propTypes = {
        value: PropTypes.number,
        max: PropTypes.number,
    };

    render() {
        const { max, value } = this.props;

        const hearts = [];
        for (let i = 0; i < max; i += 1) {
            if (i < value) {
                hearts.push(<HeartFull key={`${i}_full`} className={styles.heart} />);
            } else {
                hearts.push(<HeartEmpty key={`${i}_empty`} className={styles.heart} />);
            }
        }

        return (
            <div className={styles.lives}>
                <div className={styles.label}>Lives:</div>
                <div className={styles.hearts}>{hearts}</div>
            </div>
        );
    }
}
