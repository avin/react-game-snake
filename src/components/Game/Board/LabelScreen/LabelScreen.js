import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.module.scss';

export default class LabelScreen extends React.Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        blink: PropTypes.bool,
    };

    render() {
        const { active, label, blink } = this.props;
        if (!active) {
            return null;
        }

        return (
            <div className={styles.screen}>
                <div className={classNames(styles.label, { [styles.blink]: blink })}>{label}</div>
            </div>
        );
    }
}
