import React from 'react';
import { connect } from 'react-redux';
import FlashChange from '@avinlab/react-flash-change';
import StatusBar from './StatusBar/StatusBar';
import styles from './styles.module.scss';
import Board from './Board/Board';

export class Game extends React.Component {
    render() {
        const { score } = this.props;
        return (
            <FlashChange
                value={score}
                flashDuration={100}
                className={styles.game}
                flashClassName={styles.flash}
                outerElementType="span"
                compare={(prevProps, nextProps) => nextProps.value > prevProps.value}
            >
                <StatusBar />
                <Board />
            </FlashChange>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        score: state.game.get('score'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(Game);
