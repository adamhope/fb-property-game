FbPropertyGame::Application.routes.draw do

  match '/listings/random',          :to => 'listings#show_random', :via => :get
  match '/listings/similar_to/:id',  :to => 'listings#similar_to',  :via => :get
  match '/listings/:id',             :to => 'listings#show',        :via => :get

  match '/users/:ids',               :to => 'users#show',           :via => :get
  match '/user/:id',                 :to => 'users#show',           :via => :get
  match '/user/:id',                 :to => 'users#update',         :via => [ :post, :put ]

end
