Rails.application.routes.draw do
  resources :messages, only: [:update, :destroy]
  resources :channels, only: [:index, :show] do
    resources :messages, only: [:index, :create]
  end
  resource :user, only: [:show]
  resources :users, only: [:index]
  mount Knock::Engine, at: "/"
  root to: "application#show"
  get '*path', to: "application#show"
end
