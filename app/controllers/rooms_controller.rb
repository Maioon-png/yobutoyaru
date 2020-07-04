class RoomsController < ApplicationController
  def index
    @rooms = Room.all
  end

  def show
    @room = Room.find(params[:id]);
    @peer = Peer.find_by(user_id: current_user.id)
    

  def create
    @peer = Peer.create(peer_params)
    respond_to do |format|
      format.json
    end
  end
  end

  private
  def peer_params
    params.require(:peer).permit(:peer).merge(user_id: current_user.id)
  end

end
