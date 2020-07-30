class RankingsController < ApplicationController
  def index 
    @records = Record.includes(:user).order("time DESC")
  end
end
