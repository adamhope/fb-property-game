class UsersController < ApplicationController
  respond_to :json, :xml

  def show
    if params[:ids]
      facebook_ids = params[:ids] ? params[:ids].split(',') : []
      respond_with User.where({ :facebook_id => facebook_ids }).all
    elsif params[:id]
      facebook_id = params[:id]
      respond_with User.where({ :facebook_id => facebook_id }).first
    end
  end

  def update
    facebook_id = params[:id]

    user             = User.find_or_create_by_facebook_id(facebook_id)
    user.score       = params[:score].to_i if params[:score]
    user.best_streak = params[:streak].to_i if params[:streak]
    user.save
  end

end
