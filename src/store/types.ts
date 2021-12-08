import { MutationTree, GetterTree } from 'vuex'
import { KnowledgeState, KnowledgeStore } from './modules/types'

export type State = {
  visibleKnowledge: Boolean
}

export type RootState = State & {
  knowledge?: KnowledgeState
}

export enum GetterTypes {
  getVisibleKnowledge = 'Get_Visible_Knowledge'
}
type GetterFuns = {
  [GetterTypes.getVisibleKnowledge] (state: State): Boolean;
}
export type Getter = GetterTree<State, RootState> & GetterFuns

export enum MutationTypes {
  setVisibleKnowledge = 'Set_Visible_Knowledge'
}
type MutationsFuns = {
  [MutationTypes.setVisibleKnowledge] (state: State, value: Boolean): void;
}
export type Mutations = MutationTree<State> & MutationsFuns
