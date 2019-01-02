import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';

export class StatusBar extends React.Component {
    render() {
        const { score, level, lives } = this.props;

        return (
            <div className={styles.bar}>
                <div className={styles.section}>Score: {score}</div>
                <div className={styles.section}>Lives: {lives}</div>
                <div className={styles.section}>Level: {level}</div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        score: state.game.get('score'),
        level: state.game.get('level'),
        lives: state.game.get('lives'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(StatusBar);
