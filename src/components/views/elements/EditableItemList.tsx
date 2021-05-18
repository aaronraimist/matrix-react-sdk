/*
Copyright 2017, 2019 New Vector Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import PropTypes from 'prop-types';
import {_t} from '../../../languageHandler';
import Field from "./Field";
import AccessibleButton from "./AccessibleButton";
import {replaceableComponent} from "../../../utils/replaceableComponent";

interface IEditableItemProps {
    index: number,
    value: string,
    onRemove: (index: number) => void,
}

interface IEditableItemState {
    verifyRemove: boolean,
}

export class EditableItem extends React.Component<IEditableItemProps, IEditableItemState> {
    static propTypes = {
        index: PropTypes.number,
        value: PropTypes.string,
        onRemove: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            verifyRemove: false,
        };
    }

    _onRemove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({verifyRemove: true});
    };

    _onDontRemove = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({verifyRemove: false});
    };

    _onActuallyRemove = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        if (this.props.onRemove) this.props.onRemove(this.props.index);
        this.setState({verifyRemove: false});
    };

    render() {
        if (this.state.verifyRemove) {
            return (
                <div className="mx_EditableItem">
                    <span className="mx_EditableItem_promptText">
                        {_t("Are you sure?")}
                    </span>
                    <AccessibleButton onClick={this._onActuallyRemove} kind="link"
                                      className="mx_EditableItem_confirmBtn">
                        {_t("Yes")}
                    </AccessibleButton>
                    <AccessibleButton onClick={this._onDontRemove} kind="link"
                                      className="mx_EditableItem_confirmBtn">
                        {_t("No")}
                    </AccessibleButton>
                </div>
            );
        }

        return (
            <div className="mx_EditableItem">
                <div onClick={this._onRemove} className="mx_EditableItem_delete" title={_t("Remove")} role="button" />
                <span className="mx_EditableItem_item">{this.props.value}</span>
            </div>
        );
    }
}

interface IProps {
    id: string,
    items: string[],
    itemsLabel?: string,
    noItemsLabel?: string,
    placeholder?: string,
    newItem?: string,
    suggestionsListId?: string,

    onItemAdded?: (item: string) => void,
    onItemRemoved?: (index: number) => void,
    onNewItemChanged?: (item: string) => void,

    canEdit?: boolean,
    canRemove?: boolean,

    error?: string, // for the benefit of PublishedAliases
}

export default class EditableItemList extends React.Component<IProps> {
    static propTypes = {
        id: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.string).isRequired,
        itemsLabel: PropTypes.string,
        noItemsLabel: PropTypes.string,
        placeholder: PropTypes.string,
        newItem: PropTypes.string,

        onItemAdded: PropTypes.func,
        onItemRemoved: PropTypes.func,
        onNewItemChanged: PropTypes.func,

        canEdit: PropTypes.bool,
        canRemove: PropTypes.bool,
    };

    _onItemAdded = (e: React.FormEvent<HTMLFormElement>) => {
        e.stopPropagation();
        e.preventDefault();

        if (this.props.onItemAdded) this.props.onItemAdded(this.props.newItem);
    };

    _onItemRemoved = (index: number) => {
        if (this.props.onItemRemoved) this.props.onItemRemoved(index);
    };

    _onNewItemChanged = (e: any) => {
        if (this.props.onNewItemChanged) this.props.onNewItemChanged(e.target.value);
    };

    _renderNewItemField() {
        return (
            <form
                onSubmit={this._onItemAdded}
                autoComplete="off"
                noValidate={true}
                className="mx_EditableItemList_newItem"
            >
                <Field label={this.props.placeholder} type="text"
                    autoComplete="off" value={this.props.newItem || ""} onChange={this._onNewItemChanged}
                    list={this.props.suggestionsListId} />
                <AccessibleButton onClick={this._onItemAdded} kind="primary" type="submit" disabled={!this.props.newItem}>
                    {_t("Add")}
                </AccessibleButton>
            </form>
        );
    }

    render() {
        const editableItems = this.props.items.map((item, index) => {
            if (!this.props.canRemove) {
                return <li key={item}>{item}</li>;
            }

            return <EditableItem
                key={item}
                index={index}
                value={item}
                onRemove={this._onItemRemoved}
            />;
        });

        const editableItemsSection = this.props.canRemove ? editableItems : <ul>{editableItems}</ul>;
        const label = this.props.items.length > 0 ? this.props.itemsLabel : this.props.noItemsLabel;

        return (<div className="mx_EditableItemList">
            <div className="mx_EditableItemList_label">
                { label }
            </div>
            { editableItemsSection }
            { this.props.canEdit ? this._renderNewItemField() : <div /> }
        </div>);
    }
}
