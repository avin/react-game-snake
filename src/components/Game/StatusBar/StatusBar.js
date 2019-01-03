import React from 'react';
import { connect } from 'react-redux';
import FlashChange from '@avinlab/react-flash-change';
import styles from './styles.module.scss';
import Lives from './Lives/Lives';

const StatusBarValueString = ({ value }) => (
    <FlashChange
        value={value}
        className={styles.valueContainer}
        flashClassName={styles.valueContainerActive}
        outerElementType="span"
    >
        <span>{value}</span>
    </FlashChange>
);

export class StatusBar extends React.Component {
    render() {
        const { score, level, lives } = this.props;

        if (level === null) {
            return (
                <div className={styles.bar}>
                    <div className={styles.logo}>*** The SNAKE ***</div>
                </div>
            );
        }

        return (
            <div className={styles.bar}>
                <div className={styles.section} style={{ marginRight: 10 }}>
                    <Lives value={lives} max={3} />
                </div>
                <div className={styles.section}>
                    Level:
                    <StatusBarValueString value={level} />
                </div>
                <div className="filler" />
                <div className={styles.section}>
                    Score:
                    <StatusBarValueString value={score} />
                </div>
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
