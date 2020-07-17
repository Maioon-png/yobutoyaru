Rails.application.routes.draw do
  devise_for :users
  devise_scope :user do
    post 'users/guest_sign_in', to: 'users/sessions#new_guest'
  end
  root 'top#index'

  resources :rooms, only: [:index, :show, :create] do
    collection do 
      post 'search'
    end
  end

  resources :records, only: [:index, :create]

end
