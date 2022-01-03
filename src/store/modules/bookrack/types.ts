import { MutationTree, GetterTree, ActionTree, Module } from 'vuex'
import { GenerateActionAugments } from '../../util'
import { RootState } from '../../types'

import { IBookrackGroupType, IBookrackType } from '../../../../types/bookrack'
import { IBookrackGroupAddType, IBookrackGroupUpdateType } from '../../../apis/bookrack'

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
  bookrackDelete = 'bookrackDelete',
  bookList = 'bookList',
  bookAdd = 'bookAdd',
  bookUpdate = 'bookUpdate',
  bookDelete = 'bookDelete',
}
type ActionsMethods = {
  [ActionTypes.bookrackList] (context: GenerateActionAugments<State, Mutations>): Promise<IBookrackGroupType[]>,
  [ActionTypes.bookrackAdd] (context: GenerateActionAugments<State, Mutations>, payload: IBookrackGroupAddType): Promise<string>,
  [ActionTypes.bookrackUpdate] (context: GenerateActionAugments<State, Mutations>, payload: IBookrackGroupUpdateType): Promise<string>,
  [ActionTypes.bookrackDelete] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>,
  [ActionTypes.bookList] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>,
  [ActionTypes.bookAdd] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>,
  [ActionTypes.bookUpdate] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>,
  [ActionTypes.bookDelete] (context: GenerateActionAugments<State, Mutations>, payload: string): Promise<string>,
}
export type Actions = ActionTree<State, RootState> & ActionsMethods

export type ModuleType = Module<State, RootState>
