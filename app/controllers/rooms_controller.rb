class RoomsController < ApplicationController
  def index
    @rooms = Room.all
  end

  def show
    @room = Room.find(params[:id]);
    @peer = Peer.find_by(user_id: current_user.id)
  end

  def create
    @peer = Peer.create(peer_params)
    respond_to do |format|
      format.json
    end
  end

  def search
      @other_peer = Peer.find_by(peer: params[:peer])
    respond_to do |format|
      format.json { render json: @other_peer.user }
      binding.pry
    end
  end

  private
  def peer_params
    params.require(:peer).permit(:peer).merge(user_id: current_user.id)
  end

end
