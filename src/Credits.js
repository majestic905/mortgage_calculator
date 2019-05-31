import React from 'react';
import {connect} from 'react-redux';
import {selectors, actions} from './reducer';
import {formatDateTime} from './misc';

class MenuItem extends React.Component {
    state = {modalOpened: false};

    toggleModal = () => this.setState(({modalOpened}) => ({modalOpened: !modalOpened}));

    onSelect = () => this.props.onSelect(this.props.index);
    onRemove = () => this.props.onRemove(this.props.index);
    onRename = (ev) => {
        ev.preventDefault();
        this.props.onRename(this.props.index, ev.target.elements[0].value);
        this.toggleModal();
    };

    render() {
        const {credit, active} = this.props;

        return (
            <li key={credit.meta.key} className="menu-item c-hand">
                <a className={active ? 'active' : undefined} onClick={this.onSelect}>
                    {credit.meta.name}
                </a>
                <div className="menu-badge">
                    <span className="text-gray mr-2" onClick={this.onSelect}>{formatDateTime(credit.meta.date)}</span>
                    <button type="button" className="btn btn-sm btn-action mr-1" onClick={this.toggleModal}>
                        <i className="icon icon-edit"/>
                    </button>
                    <button type="button" className="btn btn-sm btn-action" onClick={this.onRemove}>
                        <i className="icon icon-cross"/>
                    </button>
                </div>

                {this.state.modalOpened &&
                <div className="modal active">
                    <span className="modal-overlay" onClick={this.toggleModal}/>
                    <form className="modal-container" onSubmit={this.onRename}>
                        <div className="modal-header">
                            <div className="modal-title h5">Название</div>
                        </div>
                        <div className="modal-body">
                            <input required type="text" className="form-input" defaultValue={credit.meta.name}/>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary mr-2">
                                Сохранить
                            </button>
                            <button type="button" className="btn btn-link" onClick={this.toggleModal}>
                                Закрыть
                            </button>
                        </div>
                    </form>
                </div>}
            </li>
        );
    }
}

class Credits extends React.Component {
    render() {
        return (
            <ul id="credits-list" className="menu">
                <li className="menu-item">
                    <h3>Расчеты</h3>
                    <span id="app-version" className="text-gray">{process.env.REACT_APP_VERSION}</span>
                </li>
                <li className="divider"/>
                {this.props.credits.map((credit, index) =>
                    <MenuItem key={credit.meta.key}
                              credit={credit} index={index}
                              active={index === this.props.selectedId}
                              onSelect={this.props.selectCredit}
                              onRemove={this.props.removeCredit}
                              onRename={this.props.renameCredit}
                    />
                )}
                <li className="divider"/>
                <li className="menu-item c-hand">
                    <a onClick={this.props.addCredit}>
                        <i className="icon icon-plus"/> Создать новый расчет
                    </a>
                </li>
                {this.props.modified &&
                    <React.Fragment>
                        <li className="divider"/>
                        <li className="menu-item c-hand">
                            <a onClick={this.props.saveChanges}>
                                <i className="icon icon-check"/> Сохранить изменения
                            </a>
                        </li>
                    </React.Fragment>
                }
            </ul>
        )
    }
}

const mapStateToProps = (store) => ({
    credits: selectors.getCredits(store),
    selectedId: selectors.getSelectedId(store),
    modified: selectors.getModified(store)
});

const mapDispatchToProps = {
    addCredit: actions.addCredit,
    removeCredit: actions.removeCredit,
    selectCredit: actions.selectCredit,
    renameCredit: actions.renameCredit,
    saveChanges: actions.saveChanges
};

export default connect(mapStateToProps, mapDispatchToProps)(Credits);