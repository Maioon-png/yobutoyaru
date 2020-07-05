Rails.application.routes.draw do
  devise_for :users
  root 'top#index'

  resources :rooms, only:[:index, :show, :create] do
    collection do 
      post 'search'
    end
  end

end
