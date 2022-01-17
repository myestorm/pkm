import { MutationTree, GetterTree, ActionTree, Module } from 'vuex'
import { GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import {
  IBookrackGroupType,
  IBookType,
  IApisBookrackGroupAddType,
  IApisBookrackGroupUpdateType,
  IApisBookAddType,
  IApisBookUpdateType,
  IApisBookRemoveType
} from '../../../../types/bookrack'

export type State = {
}

export enum GetterTypes {
}
type GetterMethods = {
}
export type Getters = GetterTree<State, RootState> & GetterMethods

export enum MutationTypes {
}
type MutationsMethods = {
}
export type Mutations = MutationTree<State> & MutationsMethods

export enum ActionTypes {
  bookrackList = 'bookrackList',
  bookrackAdd = 'bookrackAdd',
  bookrackUpdate = 'bookrackUpdate',
  bookrackRemove = 'bookrackRemove',
  bookList = 'bookList',
  bookAdd = 'bookAdd',
  bookUpdate = 'bookUpdate',
  bookRemove = 'bookRemove',
  bookInfo = 'bookInfo'
}
type ActionsMethods = {
  [ActionTypes.bookrackList] (context: GenerateActionAugments<State, Mutations>): Promise<IBookrackGroupType[]>,
  [ActionTypes.bookrackAdd] (context: GenerateActionAugments<State, Mutations>, payload: IApisBookrackGroupAddType): Promise<string>,
  [ActionTypes.bookrackUpdate] (context: GenerateActionAugments<State, Mutations>, payload: IApisBookrackGroupUpdateType): Promise<string>,
  [ActionTypes.bookrackRemove] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>,

  [ActionTypes.bookList] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<IBookType[]>,
  [ActionTypes.bookAdd] (context: GenerateActionAugments<State, Mutations>, payload: IApisBookAddType): Promise<string>,
  [ActionTypes.bookUpdate] (context: GenerateActionAugments<State, Mutations>, payload: IApisBookUpdateType): Promise<string>,
  [ActionTypes.bookRemove] (context: GenerateActionAugments<State, Mutations>, payload: IApisBookRemoveType): Promise<string>,
  [ActionTypes.bookInfo] (context: GenerateActionAugments<State, Mutations>, payload: IApisBookRemoveType): Promise<IBookType | null>
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

export type ModuleType = Module<State, RootState>
