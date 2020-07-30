class RankingsController < ApplicationController
  def index 
    @records = Record.includes(:user).order("time DESC").limit(3)
  end
end
