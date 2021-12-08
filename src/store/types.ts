import { MutationTree, GetterTree } from 'vuex'

export type State = {
  visibleKnowledge: boolean
}

export type RootState = State

export enum GetterTypes {
  getVisibleKnowledge = 'getVisibleKnowledge'
}
type GetterFuns = {
  [GetterTypes.getVisibleKnowledge] (state: State): boolean;
}
export type Getter = GetterTree<State, RootState> & GetterFuns

export enum MutationTypes {
  setVisibleKnowledge = 'setVisibleKnowledge'
}
type MutationsFuns = {
  [MutationTypes.setVisibleKnowledge] (state: State, value: boolean): void;
}
export type Mutations = MutationTree<State> & MutationsFuns
