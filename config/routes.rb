FbPropertyGame::Application.routes.draw do

  match '/listings/random'          => 'listings#show_random'
  match '/listings/similar_to/:id'  => 'listings#similar_to'
  match '/listings/:id'             => 'listings#show'

end
