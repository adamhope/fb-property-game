FbPropertyGame::Application.routes.draw do

  match '/listings/random' => 'listings#show_random'
  match '/listings/:id'    => 'listings#show'

end
